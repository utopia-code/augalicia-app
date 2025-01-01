

//   createProduct(products: ProductDTO[]): ProductDTO[] {
//     return products.map((product) => ({
//       id: product.id,
//       name: product.name,
//       tel: product.tel,
//       email: product.email,
//       web: product.web,
//       address: product.address,
//       cp: product.cp,
//       location: product.location,
//       desc: product.desc,
//       coordinates: product.coordinates,
//       typeProduct: product.typeProduct,
//       typeTermalCentre: product.typeTermalCentre,
//       termalTechniques: product.termalTechniques?.map(item => ({ id: item.id, name: item.name })),
//       typeWaters: product.typeWaters?.map(item => ({ id: item.id, name: item.name })),
//       treatments: product.treatments?.map(item => ({ id: item.id, name: item.name })),
//       services: product.services?.map(item => ({ id: item.id, name: item.name })),
//       accesibility: product.accesibility?.map(item => ({ id: item.id, name: item.name })),
//       complementaryTechniques: product.complementaryTechniques?.map(item => ({ id: item.id, name: item.name })),
//       openingSeason: product.openingSeason?.map(item => ({ id: item.id, name: item.name })),
//       ageRequirement: product.ageRequirement,
//       temperature: product.temperature,
//       images: product.images?.map((item) => ({ id: item.id, name: item.name, url: item.url })),
//       notifications: product.notifications?.map((item) => ({ id: item.id, type: item.type, position: item.position, desc: item.desc, product: item.product}))
//     }))
//   }