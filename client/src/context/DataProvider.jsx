import { createContext, useState } from "react";
export const DataContext = createContext(null);//used to create a new context object
const DataProvider = ({ children }) => {
    const [ account, setAccount ] = useState({ 
        name: sessionStorage.getItem('name') || '', 
        username: sessionStorage.getItem('username') || '' 
    });
    return (
        <DataContext.Provider value={{ 
            account, 
            setAccount 
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider;