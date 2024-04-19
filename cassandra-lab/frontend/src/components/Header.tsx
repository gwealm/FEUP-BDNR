type HeaderProps = {
    title: string;
};

export function Header({ title }: HeaderProps) {
    return (
        <header>
            <h1>Bookit!</h1>
            <h2>{title}</h2>
            <hr />
        </header>
    );
}