class ActorRepository {
  constructor(db) {
    this.db = db;
  }

  async getActors() {
    const query = `SELECT * FROM actors`;
    return new Promise((resolve, reject) => {
      this.db.all(query, (err, actors) => {
        if (err) {
          console.error("Error getting all actors: ", err);
          reject(err);
        }
        resolve(actors);
      });
    });
  }

  async getActorById(id) {
    const query = `SELECT * FROM actors WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.db.get(query, [id], (err, actor) => {
        if (err) {
          console.error("Error getting actor by id: ", err);
          reject(err);
        }
        resolve(actor);
      });
    });
  }

  async addActor(actor) {
    const query = `INSERT INTO actors (name, profile_path, gender, birthday) VALUES (?, ?, ?, ?)`;
    const { name, profile_path, gender, birthday } = actor;
    return new Promise((resolve, reject) => {
      this.db.run(
        query,
        [name, profile_path, gender, birthday],
        function (err) {
          if (err) {
            console.error("Error creating actor: ", err);
            reject(err);
          }
          resolve(this.lastID);
        }
      );
    });
  }

  async updateActor(id, actor) {
    const query = `UPDATE actors SET name = ?, profile_path = ?, gender = ?, birthday = ? WHERE id = ?`;
    const { name, profile_path, gender, birthday } = actor;
    return new Promise((resolve, reject) => {
      this.db.run(
        query,
        [name, profile_path, gender, birthday, id],
        function (err) {
          if (err) {
            console.error("Error updating actor: ", err);
            reject(err);
          }
          resolve(this.changes);
        }
      );
    });
  }

  async deleteActor(id) {
    const query = `DELETE FROM actors WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.db.run(query, [id], function (err) {
        if (err) {
          console.error("Error deleting actor: ", err);
          reject(err);
        }
        resolve(this.changes);
      });
    });
  }
}

module.exports = ActorRepository;
