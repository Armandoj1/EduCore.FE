export interface Docente {
    CC: string; 
    NombreCompleto: string;
    FechaNacimiento: Date | null;
    Direccion: string;
    Telefono: string;
    edad: number;
    correo: string;
    subjects: string[];  
    grades: string[];    
    subgroups: string[]; 
}
