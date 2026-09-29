class NotFoundError(Exception):
    def __init__(self, message: str = "Recurso não encontrado"):
        self.message = message
        super().__init__(message)


class ConflictError(Exception):
    def __init__(self, message: str = "Conflito ao processar a solicitação"):
        self.message = message
        super().__init__(message)
