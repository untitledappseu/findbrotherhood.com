"use client";
import { AuthWidget } from "@/components/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { isLoggedIn } from "@/lib/utils";
import { useAptabase } from '@aptabase/react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import { ClusteredPersonMarkers } from '../components/ClusteredPersonMarkers';
import { loadPeopleDataset, Person } from '../data/people';



const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const Home: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [showCreateAccountAlert, setShowCreateAccountAlert] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { trackEvent } = useAptabase();
  const [showAd, setShowAdd] = useState(true);


  useEffect(() => {

    trackEvent("Visit")

    async function fetchData() {
      const peopleData = await loadPeopleDataset();
      setPeople(peopleData);

      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        setShowCreateAccountAlert(false);
      }


    }

    fetchData();



  }, []);

  if (!API_KEY) {
    console.error('Google Maps API key is missing.');
    return <div>Error: Google Maps API key is missing.</div>;
  }


  return (
    <div style={{
      height: '100vh', width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <APIProvider apiKey={API_KEY}>
        <div style={{ height: '97.5%', width: '100vw', position: 'relative' }}>

          <Map
            mapId="bf51a910020fa25a"
            defaultCenter={{ lat: 0, lng: 0 }} // LA coordinates
            defaultZoom={2.25}
            gestureHandling="greedy"
            disableDefaultUI
            style={{ height: '100%', width: '100%' }}
          >
            {people.length > 0 && (
              <ClusteredPersonMarkers
                people={people}
                onPersonClick={setSelectedPerson}
              />
            )}
          </Map>
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 10,
            }}
          >

          </div>
          {showCreateAccountAlert ? (<div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 10,
            }}
          >
            <Alert>



              <AlertDescription>


                <AuthWidget
                  onDone={async (newAccount) => {
                    setShowCreateAccountAlert(false);

                    if (newAccount) {
                      trackEvent("Created Account")
                      toast.success('Account created successfully!');
                      toast.success('Marker will be visible on your next visit.');
                    }
                    else {
                      trackEvent("LoggedIn")

                      toast.success('Sign In Successful!');
                    }



                  }}
                />


              </AlertDescription>




            </Alert>
          </div>) : <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 10,
            }}
          >
            <Alert>


              You are signed into your account
              <AlertDescription>

                Click on a marker to view the person's profile.



              </AlertDescription>





            </Alert>
          </div>


          }
          {showAd && (<div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              zIndex: 10,
            }}
          >
            <Alert style={{

              backgroundColor: '#F5F5F5',
              gap: '10px',
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '300px',

            }}>


              What’s really in the products you use every day? Give this free app a try to find out.
              <AlertDescription>

                <Button onClick={() => {
                  trackEvent("Clicked on Ad")
                  window.open('https://askrudi.com', '_blank');
                }
                }
                  style={{ backgroundColor: '#0057FF' }}
                >Find out now
                </Button>





              </AlertDescription>




            </Alert>

          </div>
          )}





        </div>
      </APIProvider>

      <div
        className="footer"

      >
        <Button onClick={() => {
          trackEvent("Clicked on Donate")
          window.open('https://untitledapps.lemonsqueezy.com/buy/943ff7c9-5443-4ff6-a20c-c7ed446940c7?discount=0', '_blank');
        }
        }
          style={{ backgroundColor: '#000000', fontSize: '20px', color: '#0057FF' }}
        >
          Donate to support the project
        </Button>
        <Button onClick={() => {
          trackEvent("Clicked on Privacy Policy")
          window.open('https://askrudi.com/policies', '_blank');
        }
        }
          style={{ backgroundColor: '#000000' }}
        >
          Privacy Policy & TOS
        </Button>
        <Button onClick={() => {
          trackEvent("Clicked on Untitled Apps")
          window.open('https://untitledapps.net', '_blank');
        }
        }
          style={{ backgroundColor: '#000000' }}
        >
          © Untitled Apps e.U. 2024

        </Button>
        <Button onClick={() => {
          trackEvent("Clicked on Imprint")
          window.open('https://untitledapps.net#imprint', '_blank');
        }
        }
          style={{ backgroundColor: '#000000' }}
        >
          Imprint

        </Button>


      </div>
    </div>

  );
};

export default Home;