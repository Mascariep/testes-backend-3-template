import { UserBusiness } from "../../src/business/UserBusiness"
import { SignupInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("signup", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test("cadastro bem-sucedido retorna token", async () => {
        const input: SignupInputDTO = {
            email: "example@email.com",
            name: "Example Mock",
            password: "bananinha"
        }

        const response = await userBusiness.signup(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("Testar erro no signup NAME", async () => {
        expect.assertions(2)

        const input = {
            email: "example@email.com",
            name: null,
            password: "bananinha"
        }

        try {

            await userBusiness.signup(input)

        } catch (error) {
            if (error instanceof BadRequestError){
                expect(error.message).toBe("'name' deve ser string")
                expect(error.statusCode).toBe(400)
            }    
        }
    })

    test("Testar erro no signup EMAIL", async () => {
        expect.assertions(1)

        const input = {
            email: null,
            name: "Name Mock",
            password: "bananinha"
        }

        try {
            
           await userBusiness.signup(input)

        } catch (error) {
            if (error instanceof BadRequestError){
                expect(error.message).toBe("'email' deve ser string")
            }    
        }
    })

    test("Testar erro de email ja cadastrado", async () => {
        const input: SignupInputDTO = {
            email: "example@email.com",
            name: "Example Mock",
            password: "bananinha"
        }

        const result = async () => {
            await userBusiness.signup(input)
        }
        expect(result).rejects.toThrow("'email' ja existe") 
    })
})