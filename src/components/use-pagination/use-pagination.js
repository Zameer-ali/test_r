import React from "react";
import { Pagination } from "@mui/material";

export default function UsePagination({ page, total, perPage, setPage }) {
    const [totalPages, setTotalPages] = React.useState();

    React.useEffect(() => {
        let count = total / perPage;
        setTotalPages(Math.ceil(count));
    }, []);

    const handlePagination = (event, value) => {
        setPage(value);
    }

    return (
        <Pagination count={totalPages} page={page} onChange={handlePagination} sx={styles.pg} />
    );
}

const styles = {
    pg: {
        '& .Mui-disabled': {
            display: 'none',
        },
        '& .MuiPagination-ul': {
            justifyContent: 'flex-end',
        },
        '& [aria-current=true]': {
            backgroundColor: '#000 !important',
            color: '#fff !important'
        }
    }
}