-- Author: Rosco Kalis (TheDudiful)
--
-- - help_functions.lua
--
-- - This file contains several help functions that I deemed useful for my
--   own projects.

local functions = {}

-- Used to select the objects from a table that satisfy a certain condition.
-- Loops through the objects in source and checks whether the object contains
-- the passed key together with the passed value.
-- @Arguments: source - a source table containing objects
--             key    - the key that should be checked in the objects
--             value  - the value that key should have
-- @Returns  : a table containing the objects that satisfy the condition
function functions.query(source, key, value)
    local results = {}
    local tinsert = table.insert
    for _, object in pairs(source) do
        if(type(object == "table")) then
            if object[key] == value then
                tinsert(results, object)
            end
        end
    end
    return results
end

-- Concatenates t2 to t1 and empties t2.
-- @Arguments: t1 - the table that should be concatenated onto
--             t2 - the table that should be concatenated
-- @Returns  : void
function functions.table_merge(t1, t2)
    if not t2 then return end
    local tinsert = table.insert
    local tremove = table.remove
    for key, value in pairs(t2) do
        tinsert(t1, value)
        tremove(t2, key)
    end
end

-- Computes the distance between two points using the pythogorean theorem.
-- @Arguments: (x1, y1) - the first point
--             (x2, y2) - the second point
-- @Returns  : the distance between the two points
function functions.distance(x1, y1, x2, y2)
    local a = x1 - x2
    local b = y1 - y2
    return math.sqrt(a^2 + b^2)
end

-- Copies an object
-- Works with recursive tables
-- Preserves metatables
-- Works with tables as keys
-- @Arguments: obj - object to be copied
-- @Returns  : copy of the object
function functions.copy(obj)
    if type(obj) ~= 'table' then return obj end
    local res = {}
    for key, value in pairs(obj) do
        res[functions.copy(key)] = functions.copy(value)
    end
    setmetatable(res, getmetatable(obj))
    return res
end

-- Checks whether an object is clicked
-- @Arguments: obj                - object to be checked for clicked-ness
--             (mouse_x, mouse_y) - coordinates of the mouse click
-- @Returns  : true if the object is clicked, false if not
function functions.is_clicked(obj, mouse_x, mouse_y)
    local width, height, radius

    -- Must be an object
    if type(obj) ~= "table" then return false end
    -- Must have a position
    if not obj.x or not obj.y then return false end
    -- Specifying width and height (if object has width+height or size)
    if obj.size then width = obj.size; height = obj.size end
    if obj.width and obj.height then width = obj.width; height = obj.height end
    -- Specifying radius (if object has radius)
    if obj.radius then radius = obj.radius end
    -- Circle calculation
    if radius then
        return functions.distance(mouse_x, mouse_y, obj.x, obj.y) < radius
    -- BB Calculation
    elseif width and height then
        if  mouse_x > obj.x and mouse_x < obj.x + width
        and mouse_y > obj.y and mouse_y < obj.y + height then
            return true
        end
    end
    return false
end

return functions
