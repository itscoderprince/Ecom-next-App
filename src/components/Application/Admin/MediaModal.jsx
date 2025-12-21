'use client'

import { DialogContent, DialogDescription, DialogHeader, Dialog, DialogTitle } from "@/components/ui/dialog";
import { ButtonLoading } from "../ButtonLoading";
import axios from "axios";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Loading from "../Loading";
import ModalMediaBlock from "./ModalMediaBlock";
import { toast } from "sonner";

const MediaModal = ({ open, setOpen, selectedMedia, setSelectedMedia, isMultiple }) => {

    const [previouslySelected, setPreviouslySelected] = useState([])

    React.useEffect(() => {
        if (open) {
            setPreviouslySelected(selectedMedia)
        }
    }, [open])

    const fetchMedia = async (page) => {
        const { data: response } = await axios.get(`/api/media?page=${page}&limit=18&deleteType=SD`)
        return response
    }

    const { data, isPending, isError, error, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['MediaModal'],
        queryFn: async ({ pageParam }) => await fetchMedia(pageParam),
        placeholderData: keepPreviousData,
        initialPageParam: 0,
        getNextPageParam: (LastPage, allPages) => {
            const nextPage = allPages.length
            return LastPage.hasMore ? nextPage : undefined
        }
    })

    const handleClear = () => {
        setSelectedMedia([])
        toast.success('Media cleared successfully.')
    }

    const handleClose = () => {
        setSelectedMedia(previouslySelected)
        setOpen(false)
    }

    const handleSelect = () => {
        if (selectedMedia.length <= 0) {
            return toast.error('Please select a media.')
        }
        setOpen(false)
    }
    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                handleClose()
            }}
        >
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                className="sm:max-w-[80%] p-0 py-0 bg-transparent border-0 shadow-none"
            >
                <DialogDescription className="hidden">Select media from your library</DialogDescription>
                <div className="h-[90vh] bg-white dark:bg-black p-3 rounded-sm shadow">
                    <DialogHeader className="border-b pb-3">
                        <DialogTitle className="text-foreground" >Media Library</DialogTitle>
                    </DialogHeader>

                    <div className="h-[calc(100%-80px)] overflow-auto py-2">
                        {
                            isPending ?
                                <div className="size-full flex justify-center item-center">
                                    <Loading />
                                </div>
                                :
                                isError
                                    ?
                                    <div className="size-full flex justify-center item-center">
                                        <span className="text-red-500">{error.message}</span>
                                    </div>
                                    :
                                    <div className="grid lg:grid-cols-6 grid-cols-3 gap-2">
                                        {
                                            data?.pages?.map((page, index) => (
                                                <React.Fragment key={index}>
                                                    {
                                                        page?.mediaData?.map((media) => (
                                                            <ModalMediaBlock
                                                                key={media._id}
                                                                media={media}
                                                                selectedMedia={selectedMedia}
                                                                setSelectedMedia={setSelectedMedia}
                                                                isMultiple={isMultiple}
                                                            />
                                                        ))
                                                    }
                                                </React.Fragment>
                                            ))
                                        }
                                    </div>
                        }
                    </div>

                    <div className="h-10 pt-3 border-t flex justify-between">
                        <div>
                            <ButtonLoading
                                text="Clear All"
                                variant="destructive"
                                onClick={handleClear}
                            />
                        </div>
                        <div className="flex items-center gap-5">
                            <ButtonLoading
                                text="Close"
                                variant="secondary"
                                onClick={handleClose}
                            />
                            <ButtonLoading
                                text="Select"
                                onClick={handleSelect}
                            />
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog >
    )
}

export default MediaModal;