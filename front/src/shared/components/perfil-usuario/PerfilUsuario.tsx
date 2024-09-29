interface BarraPerfilUsuarioProps {
    idUser: string;
}

export const PerfilUsario: React.FC<BarraPerfilUsuarioProps> = ({ idUser }) => { 
    const consultaUser = async() => {
        console.log('teste')
    }

    return (
        <h1>teste</h1>
    )
}