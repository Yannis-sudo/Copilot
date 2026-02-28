function YUINavbar(props: any) {
    return (
        <nav className="navbar navbar-expand-lg bg-primary">
            <div className="container-fluid">
                <a className="navbar-brand text-light fw-bold" href="#">Copilot</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        {props.links.map((link: any, index: any) => (
                            <a
                                key={index}
                                className={`nav-link ${link.active ? 'text-light' : 'disabled text-white-50'} text-light`}
                                href={link.href}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default YUINavbar;