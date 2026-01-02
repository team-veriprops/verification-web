import {FieldProps} from "@3rdparty/shared/dynamic-form/types/field-props";
import {Controller, ControllerRenderProps} from "react-hook-form";
import {Textarea} from "@3rdparty/ui/textarea";
import {getErrorMessage} from "@3rdparty/shared/dynamic-form/utils/error-message";
import { Label } from "@components/3rdparty/ui/label";

export function TextAreaField({
                                  field,
                                  control,
                                  errors,
                                //   getColorClass,
                              }: FieldProps & { getColorClass?: (index: number) => string }) {

    return (
        <Controller
            name={field.name}
            control={control}
            render={({field: {onChange, value, ...fieldProps}}: { field: ControllerRenderProps }) => (
                <div className="grid w-full gap-1.5">
                    <Label htmlFor={`${field.name}`}
                    >{field.label}</Label>
                    {errors[field.name] && (
                        <p className="text-sm text-red-500">
                            {getErrorMessage(errors[field.name])}
                        </p>
                    )}
                    <Textarea
                    onChange={onChange}
                    value={value}
                    placeholder={field.placeholder || field.label || 'Type your message here .'}
                              id={`${field.name}`}
                              {...fieldProps}
                    />
                </div>

            )
            }
        />
    )
        ;
}
