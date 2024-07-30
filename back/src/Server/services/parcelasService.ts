import queryDatabase from '../database/queryPromise'

const parcelasService = {

    deleteParcelas: async(idConta: number, tipoConta: string) => {
        if (tipoConta === 'Venda'){
            const queryDelete = "DELETE FROM parcelas_venda WHERE venda_id = ?"
            await queryDatabase(queryDelete, [idConta]);
            return `Parcelas da venda ${idConta}, excluídas com sucesso`
        } else if (tipoConta === "Compra") { 
            const queryDelete = "DELETE FROM parcelas_compra WHERE compra_id = ?"
            await queryDatabase(queryDelete, [idConta]);
            return `Parcelas da compra ${idConta}, excluídas com sucesso`
        }
    }

}

export { parcelasService };