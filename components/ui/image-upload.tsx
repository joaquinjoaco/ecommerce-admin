"use client";

import { ImagePlus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

// local imports.
import { Button } from "@/components/ui/button";


interface ImageUploadProps {
    disabled?: boolean,
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[]; // array of image urls
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {

    // good old trick for mounting, same trick as in the providers.
    const [isMounted, setIsMounted] = useState(false);

    // This will run only in the client.
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: any) => { // 'result: any' because Cloudinary doesn't have typing.
        onChange(result.info.secure_url);
    }



    // If we are in server side rendering, we return NULL
    // so that there is no hydration error possible of happening.
    if (!isMounted) {
        return null;
    }

    // But if we are on the client we return the component.
    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url, idx) => (
                    <div key={idx} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset="vi1poye4">
                {({ open }) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={onClick}
                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Subir imagen
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload;