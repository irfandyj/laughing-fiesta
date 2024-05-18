export interface User {
  id?: string;
  name: string;
  email: string;
}

// export class UserEntity extends Entity {
//   resource = Entities.USERS;

//   constructor({ id, name, email }: {
//     id?: string;
//     name: string;
//     email: string;
//   }) {
//     super();
//     this.name = name;
//     this.email = email;
//   }
// }

// export class UserEntity {
//   id?: string;
//   name: string;
//   email: string;

//   constructor({ id, name, email }: {
//     id?: string;
//     name: string;
//     email: string;
//   }) {
//     this.id = id;
//     this.name = name;
//     this.email = email;
//   }
// }