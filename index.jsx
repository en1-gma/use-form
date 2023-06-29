import { cloneDeep, isEmpty, omit, set } from 'lodash';
import { useEffect, useState } from 'react';

const INITIAL_CONFIGURATION = {
  customCallback: undefined,
  defaultIsValid: true,
  schema: undefined,
  validationGuard: () => true,
};

/**
 * @typedef {Object} useForm
 * @property {Object<string, T>} errors
 * @property {Object<string, T>} data
 * @property {handleChange} handleChange
 * @property {handleDelete} handleDelete
 * @property {validate} validate
 */

/**
 * @typedef {Object<string, T>} Configuration
 * @property {Array<(data: Object<string, T>, errors: Object<string, T>)>} customGuards
 * @property {Boolean} defaultIsValid
 * @property {Object<string, T>} schema
 * @property {(errors: Object<string, T>, data: Object<string, T>)} validationGuard
 */

/**
 *
 * @param {Object<string, T>} [initialData] Initial data object
 * @param {Configuration} [configuration] Initial configuration object
 */
const useForm = (initialData = {}, configuration = INITIAL_CONFIGURATION) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const {
    schema: yupSchema, defaultIsValid, customCallback, validationGuard,
  } = { ...INITIAL_CONFIGURATION, ...configuration };

  const [isValid, setIsValid] = useState(defaultIsValid);

  /**
   * @function handleDelete
   * @description Remove the specified keys from data.
   * @example handleDelete('x[0].y.z')
   * @param {String} keys
   * @param {(newState: Object<string, T>)} [customCb] - The callback to extend code of handleDelete's
   */
  const handleDelete = (keys, customCb = undefined) => {
    // Exclude, is a overridden method to remove properties from an object, passing a string or array<string> as path; just like the set's.
    const newState = omit(data, keys);
    if (customCb) customCb(newState);
    setData(newState);
  };

  /**
   * @function checkSchema
   * @param {Object<string, T>} schema
   * @param {Object<string, T>} context
   * @returns {Boolean} Returns false if the data's values matches the provided schema, else true.
   */
  const checkSchema = async (schema, context) => {
    let errorFields = {};
    let isItValid = true;

    try {
      await schema.validate(data, { context, abortEarly: false });
    } catch (err) {
      errorFields = err?.inner?.reduce((obj, item) => ({ ...obj, [item.path]: { message: item.message } }), {});
      isItValid = false;
    }
    setIsValid(isItValid);
    setErrors(errorFields);
    return !isEmpty(errorFields);
  };

  /**
   * @function validate
   * @description Validates and generates errors based on provided schema
   * @example validate(YupSchema)
   * @param {Object<string, T>} schema
   * @param {Object<string, T>} context
   * @returns {Boolean} Returns false if the data's values matches the provided schema, else true.
   */
  const validate = async (schema, context = {}) => {
    const isInvalid = await checkSchema(schema, context);
    setIsValid(!isInvalid);
    return isInvalid;
  };

  /**
   * @function handleChange
   * @description Handler of "onChange" event
   * @example handleChange('x[0].y.z', 255)
   * @param {String} keyPath
   * @param {*} value
   * @param {(newState: Object<string, T>, keyPath: String, value: *)} [customCb] - The callback to extend code of handleChange's
   */
  const handleChange = async (keyPath, value, customCb = undefined) => {
    const newState = cloneDeep(data);
    if (customCb) customCb(newState, keyPath, value, set);
    else set(newState, keyPath, value);
    setData(newState);
  };

  /**
   * @function resetToInitial
   * @description This function resets all states as defined in useForm init by the user.
   */
  const resetToInitial = () => {
    setData(initialData);
    setErrors({});
    setIsValid(defaultIsValid);
  };

  useEffect(async () => {
    if (!isEmpty(yupSchema) && validationGuard(errors, data, )) {
      checkSchema(yupSchema);
    }
    if (customCallback) customCallback(data, errors);
  }, [data]);

  return {
    data,
    errors,
    handleChange,
    handleDelete,
    isValid,
    resetToInitial,
    setData,
    setErrors,
    validate,
  };
};

export default useForm;
