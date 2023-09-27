const ClientError = require('../../exceptions/ClientError');

// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'developer',
//   host: 'localhost',
//   database: 'companydb',
//   password: 'developer322',
//   port: 5432,
// });

class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    // bind the method with current this
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNoteHandler = this.getNoteHandler.bind(this);
    this.putNoteHandler = this.putNoteHandler.bind(this);
    this.deleteNoteHandler = this.deleteNoteHandler.bind(this);

  }

  async postNoteHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
      const { title = 'untitled', body, tags } = request.payload;
      const noteId = await this._service.addNote({ title, body, tags });
      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          noteId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      return h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
    }
  }
  async getNotesHandler(request, h) {
    const notes = await this._service.getNotes();
    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }
  async getNoteHandler(request, h) {
    try {
      const { id } = request.params;
      const note = await this._service.getNote(id);
      return {
        status: 'success',
        data: {
          note,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      return h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);

    }
  }
  async putNoteHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
      const { id } = request.params;
      await this._service.updateNote(id, request.payload);
      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);

      }
      return h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(404);
    }
  }

  async deleteNoteHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteNote(id);
      return {
        status: 'success',
        message: 'Catatan berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);

      }

      return h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
    }
  }

  // otherHandler(request, h) {


  //   return typeof (pool.query('SELECT * FROM karyawan'));
  //   // return NotesHandler.otherHandler2();
  // }

  // static async otherHandler2(request, h) {
  //   // melakukan query mendapatkan seluruh data karyawan
  //   const result = await pool.query('SELECT * FROM karyawan');

  //   // mengembalikan seluruh karyawan dalam bentuk JavaScript array of object
  //   return result;
  // }



}

module.exports = NotesHandler