
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { getUser } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { Onboarding } from "./onboarding";
import { Drawer, DrawerTrigger } from "./ui/drawer";
interface AuthWidgetProps {
    onDone: (newAccount: boolean) => void;
}

// AuthWidget component
export function AuthWidget({ onDone }: AuthWidgetProps) {

    const [createAccount, setCreateAccount] = useState(false);
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpCodeValid, setotpCodeValid] = useState(false);

    async function authFlow(email: string) {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                shouldCreateUser: true,
            },
        });

        setLoading(false);

        if (error) {
            toast.error("Try again");
            console.error('Try again');
        } else {
            toast.success('Code sent successfully!');
            setOtpSent(true);
            console.log('Code sent successfully:', data);
        }
    }

    async function verifyOtp(otp: string) {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'email',
        });

        setLoading(false);

        if (error) {
            setotpCodeValid(false);
            console.error('Error verifying OTP:', error.message);
        } else {

            var user = await getUser();
            const { data, error } = await supabase
                .from('users')
                .select('user_id')
                .eq('user_id', user!.id)
                .single();


            if (data) {
                onDone(false);
            } else {
                setotpCodeValid(true);
            }

        }
    }

    return (


        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "300px",
            justifyContent: "start",
            alignItems: "start",
        }}>


            {!otpSent ? <p >
                Add yourself to this map and get found by others! Enter your email down below to sign in or create an account. We'll send an login/signup code to your email.

            </p> : <p >
                Enter the 6-digit code we sent to your email. Check your spam folder if you don't see it in your inbox. The code might take a few minutes to arrive.

            </p>}

            {!otpSent ? (
                <div className="w-full" >
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className="w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required

                    />
                </div>
            ) : (
                <InputOTP maxLength={6} onChange={(value) => setOtp(value)}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            )}


            {!otpSent ? (
                <Button
                    className="w-full"
                    onClick={() => authFlow(email)}
                    style={{
                        backgroundColor: "#0057FF"
                    }}
                    disabled={loading}
                >
                    {loading ? (
                        <>

                            Loading...
                        </>
                    ) : (
                        "Continue"
                    )}
                </Button>
            ) : (

                <Drawer dismissible={false} >
                    <DrawerTrigger>

                        <Button
                            className="w-full"
                            style={{
                                backgroundColor: "#0057FF"
                            }}
                            onClick={() => verifyOtp(otp)}
                            disabled={loading}
                        >
                            {loading ? (
                                <>

                                    Verifying Code...
                                </>
                            ) : (
                                "Verify OTP"
                            )}
                        </Button>
                    </DrawerTrigger>

                    <Onboarding error={!otpCodeValid}
                        onDone={onDone}
                    />

                </Drawer>
            )}


        </div>

    );
}