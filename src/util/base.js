import { resolve } from 'path';
import knex from 'knex';
import bookshelf from 'bookshelf';
import modelBase from 'bookshelf-modelbase';
import cascadeDelete from 'bookshelf-cascade-delete';
import mask from 'bookshelf-mask';
import uuid from 'bookshelf-uuid';
import jsonColumns from 'bookshelf-json-columns';
import magicCase from './magic-case';
// import knexfile from '../config/knexfile';

const qailsrcPath = resolve(process.cwd(), 'test/.qailsrc');
// eslint-disable-next-line
const qailsrc = require(qailsrcPath);

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT
} = process.env;

const knexfile = {
  client: 'mysql',
  connection: {
    host: MYSQL_HOST || 'localhost',
    user: MYSQL_USER || 'root',
    password: MYSQL_PASSWORD || '',
    database: MYSQL_DATABASE || 'qrmaps',
    port: MYSQL_PORT || 3306,
    charset: 'utf8',
    timezone: 'UTC'
  }
};

const base = bookshelf(knex(knexfile));

// 让 Model 具有返回虚拟字段的功能
if (qailsrc.virtuals) {
  base.plugin('virtuals');
}

// 让 Model 调用 toJSON 方法时具有显示／隐藏某些字段的功能
if (qailsrc.visibility) {
  base.plugin('visibility');
}

// 让 Model 具有时间戳、数据校验和部分CURD功能
base.plugin(modelBase.pluggable);

// 让 Model 具有分页功能
if (qailsrc.pagination) {
  base.plugin('pagination');
}

// 让 Model 具有删除关联数据功能
if (qailsrc.cascadeDelete) {
  base.plugin(cascadeDelete);
}

// 让 Model 具有返回自定义字段的功能
if (qailsrc.mask) {
  base.plugin(mask);
}

// 让 Model 具有自动生成UUID的功能
if (qailsrc.uuid) {
  base.plugin(uuid);
}

// 让 Model 具有自动存储序列化对象的能力
if (qailsrc.jsonColumns) {
  base.plugin(jsonColumns);
}

// 让 Model 具有自动转换对象 key 拼写的能力
if (qailsrc.magicCase) {
  base.plugin(magicCase);
}

// 外部可以base.knex取到knex client
export default base;
export const Model = base.Model;
export const Collection = base.Collection;