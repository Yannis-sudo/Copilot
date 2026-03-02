import "./../../style/buttons/ui-link.css";

export default function UILink(props: any) {
    return (
        <a href={props.href} className="link">{props.text}</a>
    );
}