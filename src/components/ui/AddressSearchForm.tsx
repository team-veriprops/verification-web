import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { publicConfig } from "@lib/config/public";

/* ------------------------------------------------------------------
   Local minimal Google type (avoids library conflicts)
------------------------------------------------------------------- */

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

/* ------------------------------------------------------------------
   Zod schema (inline)
------------------------------------------------------------------- */

const addressSchema = z
  .object({
    address: z.string().min(5, "Select a valid address"),
    country: z.string().min(1),
    state: z.string().min(2, "State is required"),
    lga: z.string().optional(),
    city: z.string().optional(),
    area: z.string().optional(),
    street: z.string().optional(),
    postalCode: z.string().optional(),
    latitude: z.string().min(1, "Latitude missing"),
    longitude: z.string().min(1, "Longitude missing"),
    placeId: z.string().min(1, "Select an address from suggestions"),
  })
  .refine(data => data.country === "Nigeria", {
    path: ["country"],
    message: "Address must be in Nigeria",
  });

type FormValues = z.infer<typeof addressSchema>;

/* ------------------------------------------------------------------
   Constants
------------------------------------------------------------------- */

const libraries: ("places")[] = ["places"];

const initialValues: FormValues = {
  address: "",
  country: "Nigeria",
  state: "",
  lga: "",
  city: "",
  area: "",
  street: "",
  postalCode: "",
  latitude: "",
  longitude: "",
  placeId: "",
};

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------- */

export default function AddressSearchForm() {
  const {
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialValues,
  });

  const autocompleteRef =
    useRef<google.maps.places.Autocomplete | null>(null);

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------- */

  const extract = (
    components: GoogleAddressComponent[],
    types: string[]
  ): string =>
    components.find(c => types.some(t => c.types.includes(t)))
      ?.long_name ?? "";

  /** Reset all derived fields when user starts typing */
  const onAddressInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    reset({
      ...initialValues,
      address: e.target.value,
    });
  };

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place.address_components || !place.geometry) return;

    const components =
      place.address_components as GoogleAddressComponent[];

    setValue("address", place.formatted_address || "");
    setValue("country", extract(components, ["country"]));
    setValue("state", extract(components, ["administrative_area_level_1"]));
    setValue("lga", extract(components, ["administrative_area_level_2"]));

    // Nigerian reality: city can be inconsistent
    setValue(
      "city",
      extract(components, ["locality"]) ||
        extract(components, ["administrative_area_level_3"])
    );

    setValue(
      "area",
      extract(components, [
        "sublocality",
        "sublocality_level_1",
        "neighborhood",
      ])
    );

    setValue("street", extract(components, ["route"]));
    setValue("postalCode", extract(components, ["postal_code"]));

    setValue(
      "latitude",
      place?.geometry?.location?.lat().toString() ?? ""
    );
    setValue(
      "longitude",
      place?.geometry?.location?.lng().toString() ?? ""
    );

    setValue("placeId", place.place_id || "");
  };

  /* ------------------------------------------------------------------
     Render
  ------------------------------------------------------------------- */

  return (
    <LoadScript
      googleMapsApiKey={publicConfig.googleMapsApiKey!}
      libraries={libraries}
    >
      <div className="space-y-2 max-w-md">
        {/* Address search */}
        <Autocomplete
          onLoad={ref => (autocompleteRef.current = ref)}
          onPlaceChanged={onPlaceChanged}
          options={{
            componentRestrictions: { country: "ng" },
            fields: [
              "address_components",
              "geometry.location",
              "formatted_address",
              "place_id",
            ],
          }}
        >
          <input
            {...register("address")}
            onChange={onAddressInputChange}
            placeholder="Search property address"
            className="w-full border p-2 rounded"
          />
        </Autocomplete>

        {errors.address && (
          <p className="text-sm text-red-500">
            {errors.address.message}
          </p>
        )}

        {/* Auto-filled (disabled) fields */}
        <label>Country:
        <input {...register("country")} disabled />
        </label>
        <label>State:
        <input {...register("state")} disabled />
        </label>
        <label> LGA:
        <input {...register("lga")} disabled />
        </label>
        <label> City:
        <input {...register("city")} disabled />
        </label>
        <label> Area:
        <input {...register("area")} disabled />
        </label>
        <label> Street:
        <input {...register("street")} disabled />
        </label>
        <label> Postal code:
        <input {...register("postalCode")} disabled />
        </label>

        <div className="flex gap-2">
          <input {...register("latitude")} disabled />
          <input {...register("longitude")} disabled />
        </div>
      </div>
    </LoadScript>
  );
}
