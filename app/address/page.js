"use client";

import { useRouter } from "next/navigation";
import TextInput from "../components/TextInput";
import { useUser } from "../context/user";
import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import useIsLoading from "../hooks/useIsLoading";
import useUserAddress from "../hooks/useUserAddress";
import { toast } from "react-toastify";
import ClientOnly from "../components/ClientOnly";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useCreateAddress from "../hooks/useCreateAddress";

export default function Address() {
  const { user } = useUser();
  const router = useRouter();

  const [addressId, setAddressId] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [error, setError] = useState({});

  const showError = (type) => {
    if ((Object.entries(error), length > 0 && error?.type == type)) {
      return error.message;
    }

    return "";
  };

  const getAddress = async () => {
    if (user?.id == null || user?.id == undefined) {
      useIsLoading(false);
      return;
    }

    const response = await useUserAddress();
    if (response) {
      setTheCurrentAddress(response);
      useIsLoading(false);
      return;
    }
    useIsLoading(false);
  };

  useEffect(() => {
    useIsLoading(true);
    getAddress();
  }, [user]);

  const setTheCurrentAddress = (result) => {
    setAddressId(result.id);
    setName(result.name);
    setAddress(result.address);
    setZipcode(result.zipcode);
    setCity(result.city);
    setCountry(result.country);
  };

  const validate = () => {
    setError({});
    let isError = false;

    if (!name) {
      setError({ type: "name", message: "A name is required" });
      isError = true;
    } else if (!address) {
      setError({ type: "address", message: "An address is required" });
      isError = true;
    } else if (!zipcode) {
      setError({ type: "zipcode", message: "A zipcode is required" });
      isError = true;
    } else if (!city) {
      setError({ type: "city", message: "A city name is required" });
      isError = true;
    } else if (!country) {
      setError({ type: "country", message: "Country name is required" });
      isError = true;
    }

    return isError;
  };

  const submit = async (event) => {
    event.preventDefault();
    const isError = validate();

    if (isError) {
      toast.error(error.message, { autoClose: 3000 });
      return;
    }

    try {
      setIsUpdatingAddress(true);

      const response = await useCreateAddress({
        addressId,
        name,
        address,
        zipcode,
        city,
        country,
      });

      setTheCurrentAddress(response);
      setIsUpdatingAddress(false);

      toast.success("Address updated!", { autoClose: 3000 });

      router.push("/checkout");
    } catch (error) {
      setIsUpdatingAddress(false);
      console.log(error);
      alert(error);
    }
  };

  return (
    <>
      <MainLayout>
        <div id="AddressPage" className="mt-4 max-w-[600px] mx-auto px-2">
          <div className="mx-auto bg-white rounded-lg p-3">
            <div className="text-xl text-bold mb-2">Address Details</div>

            <form onSubmit={submit}>
              <div className="mb-4">
                <ClientOnly>
                  <TextInput
                    className="w-full"
                    string={name}
                    onUpdate={setName}
                    placeholder="Name"
                    error={showError("name")}
                  />
                </ClientOnly>
              </div>
              <div className="mb-4">
                <ClientOnly>
                  <TextInput
                    className="w-full"
                    string={address}
                    onUpdate={setAddress}
                    placeholder="Address"
                    error={showError("address")}
                  />
                </ClientOnly>
              </div>
              <div className="mb-4">
                <ClientOnly>
                  <TextInput
                    className="w-full"
                    string={zipcode}
                    onUpdate={setZipcode}
                    placeholder="Zip Code"
                    error={showError("zipcode")}
                  />
                </ClientOnly>
              </div>
              <div className="mb-4">
                <ClientOnly>
                  <TextInput
                    className="w-full"
                    string={city}
                    onUpdate={setCity}
                    placeholder="City"
                    error={showError("city")}
                  />
                </ClientOnly>
              </div>
              <div className="mb-4">
                <ClientOnly>
                  <TextInput
                    className="w-full"
                    string={country}
                    onUpdate={setCountry}
                    placeholder="Country"
                    error={showError("country")}
                  />
                </ClientOnly>
              </div>
              <button
                type="submit"
                disabled={isUpdatingAddress}
                className={`mt-6 w-full text-white text-lg font-semibold p-3 rounded bg-blue-600 ${
                  isUpdatingAddress ? "bg-blue-800" : "bg-blue-600"
                }`}
              >
                {!isUpdatingAddress ? (
                  <div>Update Address</div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <AiOutlineLoading3Quarters className="animate-spin" />
                    Please wait...
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
