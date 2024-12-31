// import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
// import { Head } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import SelectBox from "@/Components/SelectBox";
// import roles from "@/data/roles.json";
import absensi from "@/data/absensi.json";
// import { Description } from "@headlessui/react/dist/components/description/description";
import { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function SubmitAttendance({ auth, submitted }) {
    console.log(submitted);

    const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        version: "weekly",
        libraries: ["geocoder"],
    });

    const [transitioning, setTransitioning] = useState(false);
    const {
        data,
        setData,
        post,
        transform,
        errors,
        processing,
        recentlySuccessful,
    } = useForm({
        status: "attend",
        Description: "",
        latitude: "",
        longitude: "",
        prepareData: {},
        address: "",
    });

    const getLatLong = (e) => {
        e.preventDefault();
        navigator.geolocation.getCurrentPosition(
            function (position) {
                createGeocode(position.coords);
            },
            function (error) {
                alert("gagal mendapatkan lokasi");
            }
        );
    };

    function createGeocode(coordinates) {
        loader.load().then(() => {
            const geocoder = new google.maps.Geocoder();

            geocoder
                .geocode({
                    location: {
                        lat: coordinates.latitude,
                        lng: coordinates.longitude,
                    },
                })
                .then((response) => {
                    if (!response.results[0]) {
                        alert("gagal mendapatkan lokasi");
                        return;
                    }

                    let ObjLocation = {
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                        address: response.results[0].formatted_address,
                    };
                    setData("prepareData", ObjLocation);
                });
        });
    }

    useEffect(() => {
        if (data.prepareData.hasOwnProperty("address")) {
            transform((data) => ({
                ...data.prepareData,
                status: data.status,
                description: data.description,
            }));
            post(route("attendances.submit"), {
                PreventScroll: true,
                onSuccess: () => {
                    alert("Absensi Berhasil Disubmit");
                },
                onError: (errors) => {
                    console.log(errors);
                },
            });
        }
    }, [data.prepareData]);

    useEffect(() => {
        if (data.status === "attend") {
            setTransitioning(false);
        } else {
            setTransitioning(true);
        }
    }, [data.status]);

    return (
        <form onSubmit={getLatLong} className="mt-6 space-y-6">
            <div>
                <InputLabel htmlFor="info" value="Silahkan lalukan absensi" />

                <SelectBox
                    onChange={(e) => setData("status", e.target.value)}
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 w-full"
                    options={absensi}
                />

                <InputError className="mt-2" message={errors.status} />
            </div>

            <Transition
                show={transitioning}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
            >
                <div>
                    <InputLabel htmlFor="description" value="Penjelasan" />

                    <TextInput
                        onChange={(e) => setData("description", e.target.value)}
                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 w-full"
                    />

                    <InputError className="mt-2" message={errors.description} />
                </div>
            </Transition>
            <div className="flex items-center gap-4 mt-2">
                <PrimaryButton disabled={processing}>Absen</PrimaryButton>
            </div>
        </form>
    );
}
