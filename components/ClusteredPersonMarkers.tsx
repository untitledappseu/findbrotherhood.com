import { getUser } from '@/lib/utils';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useMap } from '@vis.gl/react-google-maps';
import { useEffect, useMemo, useState } from 'react';
import { Person } from '../data/people';

export type ClusteredPersonMarkersProps = {
    people: Person[];
    onPersonClick: (person: Person) => void;
};

export const ClusteredPersonMarkers = ({ people, onPersonClick }: ClusteredPersonMarkersProps) => {
    const map = useMap();
    const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

    // Convert people data to google.maps.Marker
    const markers = useMemo(() =>
        people.map(person => {
            const marker = new google.maps.Marker({
                position: { lat: person.latitude, lng: person.longitude },

            });
            marker.addListener('click', async () => {
                if (infoWindow) {
                    infoWindow.close();
                }

                var user = await getUser();


                const newInfoWindow = new google.maps.InfoWindow({
                    content: user != null ? `
        <div>
        <img src="${person.pfp_url || "https://framerusercontent.com/images/gGliHSUPEod30OPhzUllBEYWftM.png"}" alt="${person.name ? `${person.name}'s profile` : 'Profile'}" style="width: 100px; height: 100px; border-radius: 50%;" />
            <h2 style=" font-family: Inter, sans-serif; font-size: 24px; font-weight: bold; margin-bottom: 10px;">${person.name}</h2>
            ${person.email ? `<p><strong>Email:</strong> <a href="mailto:${person.email}" style="color: #0057FF;">${person.email}</a></p>` : ''}
            ${person.phone_number ? `<p><strong>Phone:</strong> <a href="tel:${person.phone_number}" style="color: #0057FF;">${person.phone_number}</a></p>` : ''}
            ${person.bio ? `<p><strong>Bio:</strong> ${person.bio}</p>` : ''}
            ${person.skool_url ? `<p><strong>Skool Profile:</strong> <a href="${person.skool_url}" target="_blank" rel="noopener noreferrer" style="color: #0057FF;">${person.skool_url}</a>` : ''}
            <br />
            
        </div>
    ` :
                        "You need an account to view people's profiles",
                    position: { lat: person.latitude, lng: person.longitude }
                });


                newInfoWindow.open(map);
                setInfoWindow(newInfoWindow);
                onPersonClick(person);
            });
            return marker;
        }),
        [people, infoWindow, map, onPersonClick]
    );

    useEffect(() => {
        if (map && markers.length > 0) {
            new MarkerClusterer({
                map,
                markers,



            })
        }
    }, [map, markers]);

    return null;
};