export default function UILink(props: any) {
    return (
        <a href={props.href} className="link">{props.text}</a>
    );
}