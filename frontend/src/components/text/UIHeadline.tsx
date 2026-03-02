export default function UIHeadline(props: any) {
    if (props.level === 1) {
        return <h1 className={props.className}>{props.text}</h1>;
    } else if (props.level === 2) {
        return <h2 className={props.className}>{props.text}</h2>;
    } else if (props.level === 3) {
        return <h3 className={props.className}>{props.text}</h3>;
    } else if (props.level === 4) {
        return <h4 className={props.className}>{props.text}</h4>;
    } else if (props.level === 5) {
        return <h5 className={props.className}>{props.text}</h5>;
    } else if (props.level === 6) {
        return <h6 className={props.className}>{props.text}</h6>;
    } else {
        return <p className={props.className}>{props.text}</p>;
    }
}