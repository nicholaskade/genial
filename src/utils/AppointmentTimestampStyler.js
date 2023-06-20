export function styleTimestamp(timestamp){

    let year = timestamp.slice(0, 4);
    let month = timestamp.slice(5, 7);
    let day = timestamp.slice(8, 10);

    let hour = timestamp.slice(11, 13);
    let minute = timestamp.slice(14);

    let styledTime = (hour > 12) ? `0${hour - 12}:${minute} pm` : 
        ((hour == 12) ? 
            `12:${minute} pm`: `${hour}:${minute} am`);
            
    let styledDay = (day < 10) ? day.slice(1) : day;

    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    return `${styledDay} ${monthNames[parseInt(month)-1]} ${year} at ${styledTime}`;
};