import { Search, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import {
    clearSearch,
    search,
    setQuery,
} from "../../features/search/searchSlice";

import SearchDropdown from "./SearchDropdown";

const SearchBar = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const location = useLocation();

    const wrapperRef = useRef(null);

    const [open, setOpen] = useState(false);

    const {
        query,
        users,
        projects,
        loading,
    } = useSelector(
        state => state.search
    );

    useEffect(() => {

        const timeout = setTimeout(() => {

            if (!query.trim()) {

                dispatch(clearSearch());

                return;

            }

            if (
                location.pathname !== "/search"
            ) {

                dispatch(

                    search({

                        query,

                        type: "all",

                        limit: 5,

                    })

                );

            }

        }, 400);

        return () => clearTimeout(timeout);

    }, [
        query,
        location.pathname,
        dispatch,
    ]);
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (

                wrapperRef.current &&

                !wrapperRef.current.contains(event.target)

            ) {

                setOpen(false);

            }

        };

        document.addEventListener(

            "mousedown",

            handleClickOutside

        );

        return () =>

            document.removeEventListener(

                "mousedown",

                handleClickOutside

            );

    }, []);

    const handleSubmit = e => {

        e.preventDefault();

        if (!query.trim()) return;

        navigate(
            `/search?q=${encodeURIComponent(query)}`
        );

        setOpen(false);

        dispatch(clearSearch());

    };

    return (

        <div
            ref={wrapperRef}
            className="relative w-[420px]"
        >

            <form
                onSubmit={handleSubmit}
            >

                <Search
                    size={18}
                    className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    "
                />

                <input

                    value={query}

                    onFocus={() => setOpen(true)}

                    onChange={(e) => {

                        const value = e.target.value;

                        dispatch(
                            setQuery(value)
                        );

                        if (
                            location.pathname === "/search"
                        ) {

                            navigate(
                                `/search?q=${encodeURIComponent(value)}`,
                                {
                                    replace: true,
                                }
                            );

                        }

                    }}

                    placeholder="Search developers or projects..."

                    className="
                    w-full

                    rounded-xl

                    bg-slate-900

                    border

                    border-slate-700

                    pl-11
                    pr-10
                    py-2.5

                    text-white

                    outline-none

                    focus:border-blue-500

                    transition
                    "
                />

                {

                    loading && (

                        <Loader2
                            size={18}
                            className="
                            absolute

                            right-3
                            top-1/2

                            -translate-y-1/2

                            animate-spin

                            text-blue-400
                            "
                        />

                    )

                }

            </form>

            {

                open &&

                query.trim() &&

                (

                    <SearchDropdown
                        query={query}
                        users={users}
                        projects={projects}
                        loading={loading}
                        onClose={() => setOpen(false)}
                    />

                )

            }

        </div>

    );

};

export default SearchBar;