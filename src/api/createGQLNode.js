exports.createGQLNode = (ctx, data) => {
  const nodeMeta = {
    id: ctx.createNodeId(data.label),
    parent: null,
    children: [],
    internal: {
      type: data.name,
      mediaType: 'application/javascript',
      content: JSON.stringify({ ...data.payload }),
      contentDigest: ctx.createContentDigest({ ...data.payload })
    }
  }

  const node = { ...data.payload, ...nodeMeta }
  ctx.createNode(node)
}
