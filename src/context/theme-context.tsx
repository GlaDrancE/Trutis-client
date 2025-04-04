import { useEffect, useState, useContext, createContext } from 'react'



const ThemeContext = createContext<{ theme: string, setTheme: (theme: string) => void }>({
    theme: 'light',
    setTheme: (theme: string) => { }
})

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<string>(sessionStorage.getItem('theme') || 'light');

    useEffect(() => {
        sessionStorage.setItem('theme', theme);

        document.documentElement.classList.toggle('dark');
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

const useTheme = () => {
    return useContext(ThemeContext);
}

export { ThemeContext, ThemeProvider, useTheme };