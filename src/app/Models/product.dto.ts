import { AppointmentDTO } from "./appointment.dto";

export interface TypeProduct {
    id: number;
    name: string;
}
  
export interface TypeTermalCentre {
    id: number;
    name: string;
}
  
export interface TermalTechnique {
    id: number;
    name: string;
}
  
export interface TypeWater {
    id: number;
    name: string;
}
  
export interface Treatment {
    id: number;
    name: string;
}
  
export interface Service {
    id: number;
    name: string;
}
  
export interface Accesibility {
    id: number;
    name: string;
}
  
export interface ComplementaryTechnique {
    id: number;
    name: string;
}

export interface OpeningSeason {
    id: number;
    name: string;
}
  

export interface Image {
    id?: number;
    name: string;
    url: string;
    productId?: number;
}
  
export interface Notification {
    id?: number;
    type: string;
    position: string;
    desc: string;
    productId?: number;
}
  

export class ProductDTO {
    id?: number;
    name: string;
    tel: string;
    email: string;
    web: string;
    address: string;
    cp: string;
    location: string;
    desc: string;
    coordinates: string;
    typeProduct?: TypeProduct;
    typeTermalCentre?: TypeTermalCentre;
    termalTechniques?: TermalTechnique[];
    typeWaters?: TypeWater[];
    treatments?: Treatment[];
    services?: Service[];
    accesibility?: Accesibility[];
    complementaryTechniques?: ComplementaryTechnique[];
    openingSeason?: OpeningSeason[];
    ageRequirement?: number;
    temperature?: number;
    images?: Image[];
    notifications?: Notification[];
    userEmail?: string;
    appointments?: AppointmentDTO[];

    constructor(
        name: string,
        tel: string,
        email: string,
        web: string,
        address: string,
        cp: string,
        location: string,
        desc: string,
        coordinates: string,
    ) {
        this.name = name;
        this.tel = tel;
        this.email = email;
        this.web = web;
        this.address = address;
        this.cp = cp;
        this.location = location;
        this.desc = desc;
        this.coordinates = coordinates;
    }
}