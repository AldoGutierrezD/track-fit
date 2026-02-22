import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";


export function usePaginatedTable<T>(rpcName: string, itemsPerPage = 10) {

    const [data, setData] = useState<T[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {

        setLoading(true);

        const offset = (currentPage - 1) * itemsPerPage;

        const { data, error } = await supabase.rpc(
            rpcName,
            {
                limitd: itemsPerPage,
                offsetd: offset,
                searchd: debouncedSearch || null
            }
        );

        if (!error && data) {
            setData(data);

            const totalCount = data.length > 0 ? data[0].total_count : 0;
            setTotalPages(Math.ceil(totalCount / itemsPerPage));
        }

        setLoading(false);

    }


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search])


    useEffect(() => {
        fetchData();
    }, [currentPage, debouncedSearch]);


    return {
        data,
        search,
        setSearch,
        currentPage,
        setCurrentPage,
        totalPages,
        loading
    }

}
