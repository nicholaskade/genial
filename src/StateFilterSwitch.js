function StateFilterSwitch( { stateSorterSwitchFlipped } ){
    return (
        <div id="state-filter-switch-container">
            <label id="state-filter-switch" onChange={stateSorterSwitchFlipped}>Filter by State
                <input type="checkbox"/>
            </label>
        </div>
    )
};

export default StateFilterSwitch;