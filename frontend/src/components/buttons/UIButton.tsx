export default function UiButton(props: any) {
    return (
        <button onClick={props.onClick} type={props.type || "button"} style={{ width: props.width}} className="button">{props.text}</button>
    );
}