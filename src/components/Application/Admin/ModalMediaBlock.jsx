import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

const ModalMediaBlock = ({ media, selectedMedia, setSelectedMedia, isMultiple }) => {

    const handleCheck = () => {
        let newSelectedMedia = []
        const isSelected = selectedMedia.find(m => m._id === media._id) ? true : false
        if (isMultiple) {
            if (isSelected) {
                newSelectedMedia = selectedMedia.filter(m => m._id !== media._id)
            } else {
                newSelectedMedia = [...selectedMedia, {
                    _id: media._id,
                    url: media.secure_url,
                }]
            }
            setSelectedMedia(newSelectedMedia)
        } else {
            setSelectedMedia([{
                _id: media._id,
                url: media.secure_url,
            }])
        }
    };

    return (
        <label htmlFor={media._id} className="border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden cursor-pointer">
            <div className="absolute top-2 left-2 z-20">
                <Checkbox
                    id={media._id}
                    checked={!!selectedMedia?.find(m => m._id === media._id)}
                    onCheckedChange={handleCheck}
                />
            </div>
            <div className="size-full relative">
                <Image
                    src={media.secure_url}
                    alt={media.alt || ""}
                    width={300}
                    height={300}
                    className="object-cover h-[150px] w-full"
                />
            </div>
        </label>
    )
}

export default ModalMediaBlock;