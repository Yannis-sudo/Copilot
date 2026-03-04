export default function UiButton(props: any) {
    return (
        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            style={{ maxWidth: props.width }}
        >
            {props.text}
        </button>
    );
}