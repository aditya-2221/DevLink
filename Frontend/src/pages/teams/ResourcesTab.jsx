import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

import {
    getResources,
    deleteResource,
    incrementDownload
} from "../../services/resourceService";

import ResourceToolbar from "../../components/ui/ResourceToolbar";
import ResourceCard from "../../components/cards/ResourceCard";
import EmptyResources from "../../components/ui/EmptyResources";
import UploadResourceModal from "../../components/modals/UploadResourceModal";
import DeleteResourceModal from "../../components/modals/DeleteResourceModal";
import ResourcePreviewModal from "../../components/modals/ResourcePreviewModal";
import Pagination from "../../components/ui/Pagination";

function ResourcesTab({ teamId, isOwner }) {

    const [resources, setResources] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showUpload, setShowUpload] = useState(false);

    const [deleting, setDeleting] = useState("");

    const [search, setSearch] = useState("");

    const [type, setType] = useState("ALL");

    const [sort, setSort] = useState("latest");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResources, setTotalResources] = useState(0);
    const [debouncedSearch] = useDebounce(search, 350);

    const fetchResources = async () => {

        try {

            setLoading(true);

            const res = await getResources(teamId, {
                page,
                limit: 12,
                search: debouncedSearch,
                type,
                sort
            });

            setResources(

                res.data.data.resources

            );

            setTotalPages(res.data.data.totalPages);

            setTotalResources(res.data.data.total);

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Failed to load resources"

            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchResources();

    }, [

        page,

        debouncedSearch,

        type,

        sort,

        teamId

    ]);

    const handlePreview = (resource) => {

        setSelectedResource(resource);

        setShowPreview(true);

    };

    const handleDelete = (resource) => {

        setSelectedResource(resource);

        setShowDeleteModal(true);

    };


    const handleDownload = async (resource) => {

        try {

            await incrementDownload(resource._id);

        }

        catch (err) {

            console.log(err);

        }

        window.open(resource.url, "_blank");

    };

    return (

        <div
            className="
        
            rounded-3xl

            bg-gradient-to-br
            from-[#162238]
            via-[#111827]
            to-[#0f172a]

            border
            border-blue-500/10

            p-6

           

            transition-all
            duration-300
        "
        >
            <div className="flex ">

                <ResourceToolbar

                    search={search}

                    setSearch={(value) => {

                        setSearch(value);

                        setPage(1);

                    }}

                    type={type}

                    setType={(value) => {

                        setType(value);

                        setPage(1);

                    }}

                    sort={sort}

                    setSort={(value) => {

                        setSort(value);

                        setPage(1);

                    }}

                    onUpload={() =>

                        setShowUpload(true)

                    }
                    totalResources={totalResources}

                />


            </div>


            {

                loading ?

                    (

                        <div className="py-24 text-center text-slate-500">

                            Loading Resources...

                        </div>

                    )

                    :

                    resources.length === 0 ?

                        (

                            <EmptyResources

                                onUpload={() =>

                                    setShowUpload(true)

                                }

                            />

                        )

                        :

                        (


                            <>

                                <div
                                    className="
                grid

                md:grid-cols-2

                xl:grid-cols-2

                2xl:grid-cols-3

                gap-6
                "
                                >

                                    {

                                        resources.map(resource => (

                                            <ResourceCard

                                                key={resource._id}

                                                resource={resource}

                                                onPreview={handlePreview}

                                            />

                                        ))

                                    }

                                </div>

                                <div className="mt-8">

                                    <Pagination
                                        page={page}
                                        totalPages={totalPages}
                                        onPageChange={setPage}
                                    />

                                </div>

                            </>

                        )

            }

            <UploadResourceModal

                open={showUpload}

                onClose={() =>

                    setShowUpload(false)

                }

                teamId={teamId}

                refreshResources={fetchResources}

            />
            <ResourcePreviewModal

                open={showPreview}

                resource={selectedResource}

                canDelete={
                    isOwner ||
                    selectedResource?.uploadedBy?._id ===
                    localStorage.getItem("userId")
                }

                onClose={() => {

                    setShowPreview(false);

                    setSelectedResource(null);

                }}

                onDownload={handleDownload}

                onDelete={(resource) => {

                    setShowPreview(false);

                    handleDelete(resource);

                }}

            />

            <DeleteResourceModal

                open={showDeleteModal}

                resource={selectedResource}

                deleting={deleting}

                onClose={() => {

                    setShowDeleteModal(false);

                    setSelectedResource(null);

                }}

                onDelete={async () => {

                    try {

                        setDeleting(selectedResource._id);
                        if (resources.length === 1 && page > 1) {

                            setPage(prev => prev - 1);

                        }

                        await deleteResource(selectedResource._id);
                        setResources(prev =>

                            prev.filter(

                                r => r._id !== selectedResource._id

                            )

                        );

                        toast.success("Deleted");

                        setTotalResources(prev => prev - 1);

                    }

                    finally {

                        setDeleting("");;

                        setShowDeleteModal(false);

                    }

                }}

            />

        </div>

    );

}

export default ResourcesTab;