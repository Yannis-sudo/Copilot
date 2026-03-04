export default function UITextInput(props: any) {
    return (
        <input 
            type={props.type || "text"} 
            className="text-input"
            id={props.id || "inputText"} 
            placeholder={props.placeholder || ""} 
            onChange={props.onChange}
        />
    );
}