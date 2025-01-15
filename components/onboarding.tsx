import {
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { getUser } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AutocompleteCustom } from "./autocomplete";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";



interface OnboardingProps {
    error: boolean;
    onDone: (newAccount: boolean) => void;

}




export function Onboarding({ error, onDone }: OnboardingProps) {
    const [showAlert, setShowAlert] = useState(false);
    const [submitEnabled, setSubmitEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [skoolUrl, setSkoolUrl] = useState("");
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [checkoutUrl, setCheckoutUrl] = useState("");
    const [name, setName] = useState("");

    const [emailError, setEmailError] = useState("");
    const [skoolUrlError, setSkoolUrlError] = useState("");
    const [locationError, setLocationError] = useState("");


    useEffect(() => {
        validateForm();



    }, [email, skoolUrl, location]);




    const validateForm = async () => {





        let valid = true;

        if (!email && !skoolUrl) {
            setEmailError("Please provide at least one of the available contact methods.");
            setSkoolUrlError("Please provide at least one of the available contact methods.");
            valid = false;
        } else {
            setEmailError("");
            setSkoolUrlError("");
        }

        if (email && !validateEmail(email)) {
            setEmailError("Please provide a valid email address.");
            valid = false;
        } else {
            setEmailError("");
        }

        if (skoolUrl && !validateSkoolUrl(skoolUrl)) {
            setSkoolUrlError("Provide a Skool URL starting with 'https://www.skool.com/@'.");
            valid = false;
        } else {
            setSkoolUrlError("");
        }

        if (!location) {
            setLocationError("Please provide your location.");
            valid = false;
        } else {
            setLocationError("");
        }



        setSubmitEnabled(valid);
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateSkoolUrl = (url: string) => {
        return url.startsWith("https://www.skool.com/@");
    };

    const handleFormSubmit = async () => {
        if (!submitEnabled) return;

        setLoading(true);

        if (!location) {
            console.error("Location is not set");
            toast.error("Location is not set. Please select a location.");
            setLoading(false);
            return;
        }
        const { data: existingUsers, error: checkError } = await supabase
            .from('users')
            .select('user_id')
            .eq('latitude', location.lat)
            .eq('longitude', location.lng);

        if (checkError) {
            console.error("Error checking existing users:", checkError.message);
            toast.error("Error checking existing users. Please try again.");
            setLoading(false);
            return;
        }

        if (existingUsers && existingUsers.length > 0) {
            console.error("A user already exists at this location");
            toast.error("A user already exists at this location. Choose a street close to your home street instead.");

            setLoading(false);
            return;
        }




        let pfpUrl = "";
        if (profilePic) {
            const { data, error } = await supabase.storage
                .from("profile-pictures")
                .upload(Date.now().toFixed(99), profilePic);
            if (error) {
                console.error("Error uploading profile picture:", error.message);
                toast.error("Error uploading profile picture. Please try again.");
                setLoading(false);
                return;
            }



            var imageCurrentPath = data.path;

            var baseUrl =
                'https://qkgxzhswjrvokiayktka.supabase.co/storage/v1/object/public/profile-pictures/';



            pfpUrl = baseUrl + imageCurrentPath;
        }

        var user = await getUser();





        const { data, error: insertError } = await supabase
            .from("users")
            .insert({
                user_id: user?.id,
                email,
                name,
                bio,
                skool_url: skoolUrl,
                latitude: location.lat,
                longitude: location.lng,
                pfp_url: pfpUrl,
            });

        if (insertError) {
            console.error("Error inserting user data:", insertError.message);
            toast.error(insertError.message);
            setLoading(false);
            return;
        }

        setLoading(false);
        onDone(true);




    };





    return (
        <>

            <DrawerContent style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "20px", maxHeight: "90vh" }}>
                {error ? (
                    <DrawerHeader style={{ maxWidth: "400px" }}>
                        <DrawerTitle>Something went wrong</DrawerTitle>
                        <DrawerDescription>
                            We couldn't sign you in. Please try again. Your code was probably invalid or has expired. Codes are valid for 59 minutes. If you believe this is an issue, try again in a few minutes.
                        </DrawerDescription>
                        <DrawerFooter>
                            <DrawerClose>
                                <Button onClick={() => setShowAlert(false)}>Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerHeader>
                ) : (
                    <div style={{ maxWidth: "400px", overflow: "scroll", }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "10px" }}>
                            <Label>Let's get you ready.</Label>
                            <DrawerDescription>
                                Enter the location you want other people to find you. Please do not share your exact location. Instead, provide a general area. For example, say “a street near my actual location in London” instead of your specific address or city.
                            </DrawerDescription>
                            <AutocompleteCustom
                                onPlaceSelect={(place) => {
                                    if (place?.geometry?.location) {
                                        setLocation({
                                            lat: place.geometry.location.lat(),
                                            lng: place.geometry.location.lng(),
                                        });
                                    }
                                }}
                            />
                            {locationError && <p style={{ color: "red" }}>{locationError}</p>}

                            <InputWithLabel
                                label="Provide atleast your first name"
                                type="name"
                                id="name"
                                placeholder="Name"
                                value={
                                    name
                                }
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />
                            <DrawerDescription>Provide at least one contact method so others can reach out to you. Only users with an verified email address can see your profile.</DrawerDescription>
                            <InputWithLabel
                                label="Email"
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError && <p style={{ color: "red" }}>{emailError}</p>}
                            <InputWithLabel
                                label="Skool Profile Url"
                                type="url"
                                id="skool-url"
                                placeholder="Skool Profile Url"
                                value={skoolUrl}
                                onChange={(e) => setSkoolUrl(e.target.value)}
                            />
                            {skoolUrlError && <p style={{ color: "red" }}>{skoolUrlError}</p>}
                            <DrawerDescription>Choose a profile picture or leave it blank.</DrawerDescription>
                            <InputFile
                                label="(Optional) Profile Picture"
                                id="profile-picture"
                                onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
                            />
                            <Label>(Optional) Profile Bio</Label>
                            <DrawerDescription>Write a short bio so others can learn more about you.</DrawerDescription>
                            <Textarea
                                placeholder="Type your message here."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                            <Button
                                onClick={handleFormSubmit}
                                disabled={!submitEnabled}
                                style={{
                                    width: "100%",
                                    backgroundColor: submitEnabled ? "blue" : "gray",
                                    color: "white",
                                }}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </Button>
                        </div>



                    </div>
                )}
            </DrawerContent>
        </>
    );
}

function InputWithLabel({ label, type, id, placeholder, value, onChange }: { label: string; type: string; id: string; placeholder: string; value: string; onChange: React.ChangeEventHandler<HTMLInputElement>; }) {
    return (
        <>
            <Label htmlFor={id}>{label}</Label>
            <Input type={type} id={id} placeholder={placeholder} value={value} onChange={onChange} />
        </>
    );
}

function InputFile({ label, id, onChange }: { label: string; id: string; onChange: React.ChangeEventHandler<HTMLInputElement>; }) {
    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} type="file" onChange={onChange} />
        </div>
    );
}