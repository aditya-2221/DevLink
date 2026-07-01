import {
    ChevronLeft,
    ChevronRight
} from "lucide-react";

function Pagination({

    page,

    totalPages,

    onPageChange

}) {

    if (totalPages <= 1) return null;

    const getPages = () => {

        const pages = [];

        if (totalPages <= 7) {

            for (let i = 1; i <= totalPages; i++) {

                pages.push(i);

            }

        } else {

            pages.push(1);

            if (page > 3) {

                pages.push("...");

            }

            const start = Math.max(2, page - 1);

            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {

                pages.push(i);

            }

            if (page < totalPages - 2) {

                pages.push("...");

            }

            pages.push(totalPages);

        }

        return pages;

    };

    return (

        <div className="flex justify-center items-center gap-2 mt-10">

            <button

                disabled={page === 1}

                onClick={() => onPageChange(page - 1)}

                className="
                flex
                items-center
                justify-center

                h-10
                w-10

                rounded-xl

                bg-slate-900

                border
                border-blue-500/10

                text-slate-300

                disabled:opacity-40

                hover:border-cyan-400

                transition
                "

            >

                <ChevronLeft size={18}/>

            </button>

            {

                getPages().map((item,index)=>(

                    item==="..."

                    ?

                    <span

                        key={index}

                        className="px-2 text-slate-500"

                    >

                        ...

                    </span>

                    :

                    <button

                        key={index}

                        onClick={()=>onPageChange(item)}

                        className={`
                            h-10
                            min-w-[40px]

                            rounded-xl

                            px-3

                            transition

                            ${

                                page===item

                                ?

                                "bg-cyan-500 text-white"

                                :

                                "bg-slate-900 border border-blue-500/10 text-slate-300 hover:border-cyan-400"

                            }

                        `}

                    >

                        {item}

                    </button>

                ))

            }

            <button

                disabled={page===totalPages}

                onClick={()=>onPageChange(page+1)}

                className="
                flex
                items-center
                justify-center

                h-10
                w-10

                rounded-xl

                bg-slate-900

                border
                border-blue-500/10

                text-slate-300

                disabled:opacity-40

                hover:border-cyan-400

                transition
                "

            >

                <ChevronRight size={18}/>

            </button>

        </div>

    );

}

export default Pagination;