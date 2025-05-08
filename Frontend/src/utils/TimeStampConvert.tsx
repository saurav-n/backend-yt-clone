export default function convertTimeStamp(timeStamp: string) {
    const now = new Date();
    const date = new Date(timeStamp);

    const diff = now.getTime() - date.getTime(); // difference in milliseconds

    const msInMinute = 60 * 1000;
    const msInHour = 60 * msInMinute;
    const msInDay = 24 * msInHour;
    const msInWeek = 7 * msInDay;
    const msInMonth = 30 * msInDay; // Approximation
    const msInYear = 365 * msInDay; // Approximation

    const years = Math.floor(diff / msInYear);
    const months = Math.floor((diff % msInYear) / msInMonth);
    const weeks = Math.floor((diff % msInMonth) / msInWeek);
    const days = Math.floor((diff % msInWeek) / msInDay);
    const hours = Math.floor((diff % msInDay) / msInHour);
    const minutes = Math.floor((diff % msInHour) / msInMinute);
    const seconds = Math.floor((diff % msInMinute) / 1000);

    const timeArray=[years,months,weeks,days,hours,minutes,seconds]

    const timeArrayInString=['years','months','weeks','days','hours','minutes','seconds']

    for (const time of timeArray) {
        if(time>0) return `${time} ${timeArrayInString[timeArray.indexOf(time)]} ago`
    }

    return 'just now'
}