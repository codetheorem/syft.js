"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const controller = require("./controller");
const DimArray_1 = require("./DimArray");
const AsyncInit_1 = require("./AsyncInit");
const TENSOR_SUPER = {};
const TensorSerializer_1 = require("./TensorSerializer");
const tensorSerializer = new TensorSerializer_1.TensorSerializer;
class Tensor extends AsyncInit_1.AsyncInit {
    constructor($) {
        super();
        if ($ !== TENSOR_SUPER) {
            throw new Error('Cannot Contruct Tensor');
        }
    }
    static deserialize(str) {
        return tensorSerializer.deserialize(str);
    }
    serialize(optimizeStorage = false) {
        return tensorSerializer.serialize(this, optimizeStorage);
    }
    finish(id) {
        let self = this;
        self.id = id;
    }
    delete() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            self.__delete__();
            yield self.ready();
            if (self.id) {
                self.no_params_func('delete');
            }
        });
    }
    autograd(state) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
        });
    }
    params_func(name, params, return_response = false, return_type = 'FloatTensor', data_is_pointer = true) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            let res = yield controller.sendJSON(self.cmd(name, params));
            controller.log(res);
            if (return_response) {
                if (return_type == 'IntTensor') {
                    controller.log(`IntTensor.__init__: ${res}`);
                    return new IntTensor(res, data_is_pointer);
                }
                else if (return_type == 'FloatTensor') {
                    controller.log(`FloatTensor.__init__: ${res}`);
                    if (res == '') {
                        return null;
                    }
                    return new FloatTensor(res, data_is_pointer);
                }
                else {
                    return res;
                }
            }
            return self;
        });
    }
    no_params_func(name, return_response = false, return_type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.params_func(name, [], return_response, return_type || self.type);
        });
    }
    get(param_name = 'size', response_as_tensor = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            if (response_as_tensor) {
                return yield self.params_func('get', [param_name], true, self.type, true);
            }
            else {
                return yield self.params_func('get', [param_name], true, 'string', false);
            }
        });
    }
    cmd(functionCall, tensorIndexParams = []) {
        let self = this;
        return {
            'functionCall': functionCall,
            'objectType': self.type,
            'objectIndex': self.id,
            'tensorIndexParams': tensorIndexParams
        };
    }
    is_contiguous() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            let txt = yield self.no_params_func('is_contiguous', true);
            if (txt == 'true') {
                return true;
            }
            else {
                return false;
            }
        });
    }
    to_numpy() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            let res;
            if (self.is_contiguous()) {
                res = yield controller.sendJSON({
                    'functionCall': 'to_numpy',
                    'objectType': self.type,
                    'objectIndex': self.id
                });
                return res;
            }
            else {
                return ' - non-contiguous - ';
            }
        });
    }
    __repr__(verbose = true) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            let tensor_str = yield self.to_numpy();
            let type_str = (yield self.shape()).join('x');
            let grad = yield self.get('grad');
            if (grad == '') {
                grad = 'None';
            }
            let co = String(yield self.creation_op());
            let desc = `[syft.${self.type}: ${self.id} grad: ${grad} size: ${type_str} init: ${co}]\n`;
            if (verbose) {
                let children = yield self.children();
                let creators = yield self.creators();
                if (children.length > 0) {
                    desc += '\n\t-----------children-----------\n';
                }
                for (let child_id of children) {
                    desc += '\t' + (yield (yield controller.get_tensor(child_id)).__repr__(false));
                }
                if (children.length > 0) {
                    if (creators.length > 0) {
                        desc += '\t------------------------------\n';
                    }
                    else {
                        desc += '\t------------------------------\n\n\n';
                    }
                }
                if (creators.length > 0) {
                    desc += '\n\t-----------creators-----------\n';
                }
                for (let parent_id of creators) {
                    desc += '\t' + (yield (yield controller.get_tensor(parent_id)).__repr__(false));
                }
                if (creators.length > 0) {
                    desc += '\t------------------------------\n\n\n';
                }
                return tensor_str + '\n' + desc;
            }
            return desc;
        });
    }
    abs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('abs', true);
        });
    }
    abs_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('abs_');
        });
    }
    acos() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('acos', true);
        });
    }
    acos_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('acos_');
        });
    }
    addmm_(x, y) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready(),
                y.ready()
            ]);
            return yield self.params_func('addmm_', [x.id, y.id]);
        });
    }
    addmm(x, y) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready(),
                y.ready()
            ]);
            let copy = yield self.copy();
            yield copy.params_func('addmm_', [x.id, y.id]);
            return copy;
        });
    }
    addmv_(x, y) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready(),
                y.ready()
            ]);
            return yield self.params_func('addmv_', [x.id, y.id]);
        });
    }
    addmv(x, y) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready(),
                y.ready()
            ]);
            let copy = yield self.copy();
            yield copy.params_func('addmv_', [x.id, y.id]);
            return copy;
        });
    }
    asin() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('asin', true);
        });
    }
    asin_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('asin_');
        });
    }
    atan() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('atan', true);
        });
    }
    atan_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('atan_');
        });
    }
    __add__(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return self.arithmetic_operation(x, 'add', false);
        });
    }
    __iadd__(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return self.arithmetic_operation(x, 'add', true);
        });
    }
    backward(grad) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            if (grad == void 0) {
                self.no_params_func('backward');
            }
            else {
                self.params_func('backward', [grad.id]);
            }
        });
    }
    ceil() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('ceil', true);
        });
    }
    ceil_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('ceil_');
        });
    }
    contiguous() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('contiguous', true);
        });
    }
    copy() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            let t = yield self.no_params_func('copy', true);
            if (t instanceof Tensor) {
                return t;
            }
            throw new Error('Failed To Copy Tensor');
        });
    }
    cos() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('cos', true);
        });
    }
    cos_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('cos_');
        });
    }
    cosh() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('cosh', true);
        });
    }
    cosh_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('cosh_');
        });
    }
    children() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            let res = yield self.get('children');
            if (res.length > 0) {
                return [];
            }
            return [];
        });
    }
    creation_op() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.get('creation_op');
        });
    }
    creators() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            let res = yield self.get('creators');
            if (typeof res == 'string' && res.length > 0) {
                return res.split(',').slice(0, -1).map(a => Number(a));
            }
            return [];
        });
    }
    cumsum(dim = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.params_func('cumsum', [dim], true);
        });
    }
    dataOnGpu() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            if ((yield self.get('dataOnGpu')) == '1') {
                return true;
            }
            return false;
        });
    }
    exp() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('exp', true);
        });
    }
    exp_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('exp_');
        });
    }
    expand(...args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.params_func('expand', args, true);
        });
    }
    index_add(indices, dim, x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return yield self.params_func('index_add', [indices.id, dim, x.id], true);
        });
    }
    index_add_(indices, dim, x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return yield self.params_func('index_add_', [indices.id, dim, x.id], true);
        });
    }
    index_select(dim, indices) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.params_func('index_select', [indices.id, dim], true);
        });
    }
    __truediv__(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return yield self.arithmetic_operation(x, 'div', false);
        });
    }
    __itruediv__(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return yield self.arithmetic_operation(x, 'div', true);
        });
    }
    keepgrad() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            if ((yield self.get('keepgrad')) == '1') {
                return true;
            }
            else {
                return false;
            }
        });
    }
    __pow__(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return yield self.arithmetic_operation(x, 'pow', false);
        });
    }
    __ipow__(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return yield self.arithmetic_operation(x, 'pow', true);
        });
    }
    pow(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return yield self.arithmetic_operation(x, 'pow', false);
        });
    }
    pow_(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return yield self.arithmetic_operation(x, 'pow', true);
        });
    }
    floor() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('floor', true);
        });
    }
    floor_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('floor_');
        });
    }
    round() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('round', true);
        });
    }
    round_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('round_');
        });
    }
    mm(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return self.params_func('mm', [x.id], true);
        });
    }
    grad() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.get('grad', true);
        });
    }
    __mod__(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return yield self.arithmetic_operation(x, 'remainder', false);
        });
    }
    __imod__(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return self.arithmetic_operation(x, 'remainder', true);
        });
    }
    __mul__(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return yield self.arithmetic_operation(x, 'mul', false);
        });
    }
    __imul__(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return yield self.arithmetic_operation(x, 'mul', true);
        });
    }
    __neg__() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.neg();
        });
    }
    neg() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('neg', true);
        });
    }
    neg_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('neg_');
        });
    }
    relu() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('relu', true);
        });
    }
    save(filename) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('save', [filename], true, 'bool');
        });
    }
    set(param_name = 'size', params = []) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.params_func('set', [...param_name, params], true, 'none');
        });
    }
    sigmoid_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('sigmoid_');
        });
    }
    sigmoid() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('sigmoid', true);
        });
    }
    sign() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('sign', true);
        });
    }
    sign_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('sign_');
        });
    }
    sin() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('sin', true);
        });
    }
    sin_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('sin_');
        });
    }
    size() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.get('size');
        });
    }
    shape(as_list = true) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            if (as_list) {
                return ((yield self.get('shape')) || '').split(',').map(a => Number(a));
            }
            else {
                return yield self.no_params_func('shape', true);
            }
        });
    }
    softmax(dim = -1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('softmax', [dim], true);
        });
    }
    std(dim = -1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('std', [dim], true);
        });
    }
    stride(dim = -1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            if (dim == -1) {
                return self.no_params_func('stride', true);
            }
            else {
                let strides = yield self.params_func('stride', [dim], true);
                return strides.split(' ');
            }
        });
    }
    sqrt() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('sqrt', true);
        });
    }
    sqrt_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('sqrt_');
        });
    }
    trace() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('trace', true);
        });
    }
    trunc() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('trunc', true);
        });
    }
    __sub__(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return self.arithmetic_operation(x, 'sub', false);
        });
    }
    __isub__(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return self.arithmetic_operation(x, 'sub', true);
        });
    }
    view(...args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('view', args, true);
        });
    }
    view_(...args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            yield self.params_func('view_', args, false);
            return self;
        });
    }
    view_as(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            return self.params_func('view_as', [x.id], true);
        });
    }
    view_as_(x) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield Promise.all([
                self.ready(),
                x.ready()
            ]);
            self.params_func('view_as_', [x.id], false);
            return self;
        });
    }
    T() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('transpose', true);
        });
    }
    triu(k = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('triu', [k], true);
        });
    }
    triu_(k = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('triu_', [k]);
        });
    }
    unsqueeze(dim) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('unsqueeze', [dim], true);
        });
    }
    unsqueeze_(dim) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('unsqueeze_', [dim], true);
        });
    }
    zero_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('zero_');
        });
    }
    __str__() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return String(yield self.to_numpy()).replace(']', ' ').replace('[', ' ');
        });
    }
    cpu() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('cpu');
        });
    }
    gpu() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return yield self.no_params_func('gpu');
        });
    }
    arithmetic_operation(x, name, inline = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            let operation_cmd = name;
            let parameter;
            if (x instanceof Tensor) {
                operation_cmd += '_elem';
                parameter = x.id;
            }
            else {
                operation_cmd += '_scalar';
                parameter = String(x);
            }
            if (inline) {
                operation_cmd += '_';
            }
            let response = yield controller.sendJSON(self.cmd(operation_cmd, [parameter]));
            return new FloatTensor(String(response), true);
        });
    }
    sinh() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('sinh', true);
        });
    }
    sinh_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('sinh_');
        });
    }
    log() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('log', true);
        });
    }
    log_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('log_');
        });
    }
    log1p_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('log1p_');
        });
    }
    log1p() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('log1p', true);
        });
    }
    frac() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('frac', true);
        });
    }
    frac_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('frac_');
        });
    }
    reciprocal() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('reciprocal', true);
        });
    }
    reciprocal_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('reciprocal_');
        });
    }
    rsqrt() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('rsqrt', true);
        });
    }
    rsqrt_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('rsqrt_');
        });
    }
    remainder(divisor) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.arithmetic_operation(divisor, 'remainder');
        });
    }
    remainder_(divisor) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.arithmetic_operation(divisor, 'remainder', 'FloatTensor');
        });
    }
    sample(dim) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('sample', [dim], true, 'IntTensor');
        });
    }
    tan() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('tan', true);
        });
    }
    tan_() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('tan_');
        });
    }
    tanh() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.no_params_func('tanh', true);
        });
    }
    squeeze(dim = -1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('squeeze', [dim], true);
        });
    }
    squeeze_(dim = -1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('squeeze_', [dim]);
        });
    }
    min(dim = -1, keepdim = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('min', [dim, keepdim], true);
        });
    }
    max(dim = -1, keepdim = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('max', [dim, keepdim], true);
        });
    }
    sum(dim = -1, keepdim = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('sum', [dim, keepdim], true);
        });
    }
    prod(dim = -1, keepdim = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('prod', [dim, keepdim], true);
        });
    }
    mean(dim = -1, keepdim = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield self.ready();
            return self.params_func('mean', [dim, keepdim], true);
        });
    }
}
Tensor.__tensor__ = {};
exports.Tensor = Tensor;
class IntTensor extends Tensor {
    constructor(data, data_is_pointer = false) {
        super(TENSOR_SUPER);
        this.type = 'IntTensor';
        let self = this;
        if (!data) {
            throw Error('Invalid Data');
        }
        if (data instanceof DimArray_1.IntDimArray) {
            self.data = data;
            controller.sendJSON({
                'objectType': self.type,
                'functionCall': 'create',
                'data': Array.from(self.data.data),
                'shape': Array.from(self.data.shape)
            })
                .then(res => self.__finish__(res))
                .catch(err => self.__error__(err));
        }
        else if (Array.isArray(data)) {
            self.data = new DimArray_1.IntDimArray(data);
            controller.sendJSON({
                'objectType': self.type,
                'functionCall': 'create',
                'data': Array.from(self.data.data),
                'shape': Array.from(self.data.shape)
            })
                .then(res => self.__finish__(res))
                .catch(err => self.__error__(err));
        }
        else if (data_is_pointer) {
            self.id = data;
            self.data_is_pointer = true;
            self.__finish__(data);
        }
    }
}
exports.IntTensor = IntTensor;
class FloatTensor extends Tensor {
    constructor(data, autograd = false, data_is_pointer = false) {
        super(TENSOR_SUPER);
        this.type = 'FloatTensor';
        let self = this;
        if (!data) {
            throw Error('Invalid Data');
        }
        if (autograd) {
            self.autograd(true);
        }
        if (data instanceof DimArray_1.FloatDimArray) {
            self.data = data;
            controller.sendJSON({
                'objectType': self.type,
                'functionCall': 'create',
                'data': Array.from(self.data.data),
                'shape': Array.from(self.data.shape)
            })
                .then(res => self.__finish__(res))
                .catch(err => self.__error__(err));
        }
        else if (Array.isArray(data)) {
            self.data = new DimArray_1.FloatDimArray(data);
            controller.sendJSON({
                'objectType': self.type,
                'functionCall': 'create',
                'data': Array.from(self.data.data),
                'shape': Array.from(self.data.shape)
            })
                .then(res => self.__finish__(res))
                .catch(err => self.__error__(err));
        }
        else if (data_is_pointer) {
            self.id = data;
            self.data_is_pointer = true;
            self.__finish__(data);
        }
    }
}
exports.FloatTensor = FloatTensor;
//# sourceMappingURL=Tensor.js.map