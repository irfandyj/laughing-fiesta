enum Entities {
  USERS = 'users',
  ROOMS = 'rooms',
  MESSAGES = 'messages',
}

abstract class Entity {
  static resource: Entities;
  [key: string]: any;

  /**
   * Finds all entities in the database
   */
}