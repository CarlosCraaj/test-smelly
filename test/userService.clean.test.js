const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes Limpa', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('deve criar usuário com dados válidos', () => {
    const usuarioCriado = userService.createUser(dadosUsuarioPadrao.nome, dadosUsuarioPadrao.email, dadosUsuarioPadrao.idade);

    expect(usuarioCriado.id).toBeDefined();
  });

  test('deve buscar usuário pelo ID corretamente', () => {
    const usuarioCriado = userService.createUser(dadosUsuarioPadrao.nome, dadosUsuarioPadrao.email, dadosUsuarioPadrao.idade);

    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    expect(usuarioBuscado.nome).toBe(dadosUsuarioPadrao.nome);
    expect(usuarioBuscado.status).toBe('ativo');
  });

  test('deve desativar usuário comum com sucesso', () => {
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    const resultado = userService.deactivateUser(usuarioComum.id);

    expect(resultado).toBe(true);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve desativar usuário administrador', () => {
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    const resultado = userService.deactivateUser(usuarioAdmin.id);

    expect(resultado).toBe(false);
  });

  test('deve gerar relatório com informações dos usuários', () => {
    userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    const relatorio = userService.generateUserReport();

    expect(relatorio).toContain('--- Relatório de Usuários ---');
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('Bob');
    expect(relatorio).toContain('Status: ativo');
  });

  test('deve lançar erro quando usuário é menor de 18 anos', () => {
    const nome = 'Menor';
    const email = 'menor@email.com';
    const idade = 17;

    expect(() => {
      userService.createUser(nome, email, idade);
    }).toThrow('O usuário deve ser maior de idade.');
  });

  test('deve gerar relatório vazio quando não há usuários', () => {
    // Nenhum usuário criado

    const relatorio = userService.generateUserReport();

    expect(relatorio).toContain('--- Relatório de Usuários ---');
    expect(relatorio).toContain('Nenhum usuário cadastrado.');
  });
});