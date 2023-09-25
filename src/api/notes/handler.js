const ClientError = require('../../exceptions/ClientError');

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

  postNoteHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
      const { title = 'untitled', body, tags } = request.payload;
      const noteId = this._service.addNote({ title, body, tags });
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
  getNotesHandler(request, h) {
    const notes = this._service.getNotes();
    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }
  getNoteHandler(request, h) {
    try {
      const { id } = request.params;
      const note = this._service.getNote(id);
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
      }).response.code(500);

    }
  }
  putNoteHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
      const { id } = request.params;
      this._service.updateNote(id, request.payload);
      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui',
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
      }).code(404);
    }
  }

  deleteNoteHandler(request, h) {
    try {
      const { id } = request.params;
      this._service.deleteNote(id);
      return {
        status: 'success',
        message: 'Catatan berhasil dihapus',
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

}

module.exports = NotesHandler