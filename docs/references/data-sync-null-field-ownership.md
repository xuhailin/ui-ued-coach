# 数据同步中的 NULL 覆盖与字段所有权

## 场景

- 业务系统先在目标表写入时间、操作人或状态。
- 上游增量同步稍后更新同一行。
- 两个相似字段表现不同：一个保留原值，另一个被覆盖成 `NULL`。
- 容易误判成数据库类型、缓存、更新时间先后或 ORM 的随机行为。

## 关键判断

先比较两个字段是否都注册在同步字段映射中。

| 字段状态 | 增量同步结果 |
| --- | --- |
| 已映射且参与更新 | 来源值是 `NULL` 时，目标字段可能被清空 |
| 未映射或明确排除 | 不进入同步更新，目标系统原值通常得以保留 |

因此，`NULL` 不等于“不更新”。真正决定结果的是字段是否属于本次同步的更新集合。

## 原理

典型同步链路是：

```text
来源查询
  → 字段映射清单
  → 映射为目标实体
  → 更新目标表
```

来源结果中的 SQL `NULL` 是一个真实值。字段一旦注册并参与更新，下游通常会执行类似：

```sql
UPDATE target_table
SET mapped_time = NULL
WHERE source_key = ...;
```

另一个字段如果没有映射，就不会进入更新集合。这会造成“同一条同步任务中，一个时间被清空、另一个时间保留”的表象。

## 稳定解法

1. 选择一个正常字段和一个异常字段，逐环对照来源表达式、字段映射和目标更新范围。
2. 先确定字段所有权：它应该由来源系统维护，还是由目标业务系统维护。
3. 目标系统拥有的字段，应在同步配置中明确排除，而不是依赖来源返回 `NULL`。
4. 来源系统拥有的字段，应提供语义正确的来源值，不能用相邻事件的时间代替。
5. 时间字段必须按业务事件区分，例如“操作时间”和“核对时间”不能因字段相近而互相映射。
6. 修改字段映射后，检查同步服务是否缓存配置；必要时按现场流程刷新缓存或重启服务。

## 排查 SQL

以下示例用于比较同一同步项中的正常字段和异常字段：

```sql
SELECT
    IMPORT_ITEMCODE,
    SOURCE_NAME,
    TARGET_NAME,
    PROPERTY_NAME,
    IS_INCLUDE,
    NOT_NULL,
    DB_TYPE,
    COMMENTS
FROM dbo.SYNC_FIELD_MAPITEM WITH (NOLOCK)
WHERE IMPORT_ITEMCODE = @import_item_code
  AND (
       UPPER(SOURCE_NAME) IN (@bad_field, @good_field)
       OR UPPER(TARGET_NAME) IN (@bad_field, @good_field)
       OR UPPER(PROPERTY_NAME) IN (@bad_field, @good_field)
  )
ORDER BY TARGET_NAME, SOURCE_NAME;
```

同时检查来源脚本：

```sql
SELECT CODE, NAME, SOURCE_SCRIPT
FROM dbo.SYNC_IMPORTITEM WITH (NOLOCK)
WHERE CODE = @import_item_code;
```

重点搜索：

```sql
NULL AS SOME_TIME
CASE ... ELSE NULL END AS SOME_STATUS
```

## 记忆句

未映射的字段不会被同步碰；已映射字段的 `NULL`，就是一次真实的清空操作。
