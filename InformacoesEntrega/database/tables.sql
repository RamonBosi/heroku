create table usuarios(
	id serial,
  nome varchar(100) not null,
  cpf char(11) not null,
  email varchar(100) not null,
  senha varchar(200) not null,
  ativo bool not null,
  primary key(id)
);

create table enderecos(
	id serial,
  uf char(2) not null,
  cidade varchar(100) not null,
  rua varchar(100) not null,
  bairro varchar(100) not null,
  usuario_id integer not null,
  primary key(id),
  foreign key(usuario_id) references usuarios(id) on delete cascade on update cascade
);

create table formas_pagamentos(
	id serial,
  tipo_pagamento varchar(45) not null,
  usuario_id integer not null,
  primary key(id),
  foreign key(usuario_id) references usuarios(id) on delete cascade on update cascade
);