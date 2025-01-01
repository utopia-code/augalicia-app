import { ProductDTO } from "./product.dto";

export class FavouriteDTO {
    id?: number;
    productId: number;
    userEmail: string;
    product?: ProductDTO;

    constructor(
        productId: number,
        userEmail: string,
        product?: ProductDTO
    ) {
        this.productId = productId;
        this.userEmail = userEmail;
        this.product = product
    }
}