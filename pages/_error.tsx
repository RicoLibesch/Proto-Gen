import React, { useState, useEffect } from 'react';
function Error({ statusCode }: any) {
    let errorMessage = 'An error occurred';

    if (statusCode === 404) {
        errorMessage = 'Page not found.';
    } else if (statusCode === 500) {
        errorMessage = 'Internal Server Error.';
    }



    return (
        <p className="text-center text-xl">
            {`Error ${statusCode}: ${errorMessage}`}
        </p>
    );
}

Error.getInitialProps = ({ res, err }: any) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error