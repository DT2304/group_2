import Header from "../Header/Header";
import Contact from "../Contact/Contact";
function DefautLayout({ children }) {
    return (
        <div>
            <Header />
            {children}
            <Contact />
        </div>
    );
}

export default DefautLayout;