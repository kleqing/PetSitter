import { useState, useEffect } from "react";

export interface Country {
    iso2: string;
    name: string;
}

export interface State {
    iso2: string;
    name: string;
}

export const useCountries = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCountries = async () => {
        try {
            const response = await fetch("https://petsitter.runasp.net/api/location/countries");
            if (!response.ok) throw new Error("Failed to fetch countries");
            const data = await response.json();
            const countryList = data.map((item: any) => ({
            iso2: item.iso2,
            name: item.name,
            }));
            setCountries(countryList);
        } catch (err) {
            setError("Failed to load countries. Please try again later.");
        }
        };

        fetchCountries();
    }, []);

    return { countries, error };
};

export const useStates = (countryCode: string) => {
    const [states, setStates] = useState<State[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStates = async () => {
        if (!countryCode) {
            setStates([]);
            return;
        }
        try {
            const response = await fetch(`https://petsitter.runasp.net/api/location/states/${countryCode}`);
            if (!response.ok) throw new Error("Failed to fetch states");
            const data = await response.json();
            const stateList = data.map((item: any) => ({
            iso2: item.iso2,
            name: item.name,
            }));
            setStates(stateList);
        } catch (err) {
            setError("Failed to load states. Please try again later.");
        }
        };

        fetchStates();
    }, [countryCode]);

    return { states, error };
};