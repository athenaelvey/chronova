function DetailPanel({currRow}){
    return(
        currRow ? (
            <div>
                <p>{currRow.PSRJ}</p>
                <p>{currRow.classification}</p>
                <p>{currRow.P0}</p>
            </div>
        ) : (
            <p>Select a pulsar to see details</p>
        )
    )
}

export default DetailPanel